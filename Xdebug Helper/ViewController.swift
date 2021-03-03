//
//  ViewController.swift
//  Xdebug Helper
//
//  Created by Quentin Dreyer on 03/03/2021.
//

import Cocoa
import SafariServices.SFSafariApplication
import SafariServices.SFSafariExtensionManager
import os.log

let appName = "Xdebug Helper"
let extensionBundleIdentifier = "fr.qkdreyer.Xdebug-Helper.Extension"

class ViewController: NSViewController {

    @IBOutlet var appNameLabel: NSTextField!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        self.appNameLabel.stringValue = appName
        SFSafariExtensionManager.getStateOfSafariExtension(withIdentifier: extensionBundleIdentifier) { (state, error) in
            guard let state = state, error == nil else {
                var errorMessage: String = "Error: unable to determine state of the extension"

                if let errorDetail = error as NSError?, errorDetail.code == 1 {
                    errorMessage = "Couldn’t find the Native Messaging Demo extension. Are you running macOS 10.16+, or macOS 10.14+ with Safari 14+?"
                }

                DispatchQueue.main.async {
                    let alert = NSAlert()
                    alert.messageText = "Check Version"
                    alert.informativeText = errorMessage
                    alert.beginSheetModal(for: self.view.window!) { (response) in }

                    self.appNameLabel.stringValue = errorMessage
                }
                return
            }

            DispatchQueue.main.async {
                if (state.isEnabled) {
                    self.appNameLabel.stringValue = "\(appName)'s extension is currently on."
                } else {
                    self.appNameLabel.stringValue = "\(appName)'s extension is currently off. You can turn it on in Safari Extensions preferences."
                }
            }
        }
    }
    
    @IBAction func openSafariExtensionPreferences(_ sender: AnyObject?) {
        SFSafariApplication.showPreferencesForExtension(withIdentifier: extensionBundleIdentifier) { error in
            guard error == nil else {
                var errorMessage: String = "Error: unable to show preferences for the extension."

                if let errorDetail = error as NSError?, errorDetail.code == 1 {
                    errorMessage = "Couldn’t find the Xdebug Helper extension. Are you running macOS 10.16+, or macOS 10.14+ with Safari 14+?"
                }

                DispatchQueue.main.async {
                    let alert = NSAlert()
                    alert.messageText = "Check Version"
                    alert.informativeText = errorMessage
                    alert.beginSheetModal(for: self.view.window!) { (response) in }

                    self.appNameLabel.stringValue = errorMessage
                }
                return
            }

            DispatchQueue.main.async {
                NSApplication.shared.terminate(nil)
            }
        }
    }
}
